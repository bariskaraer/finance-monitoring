import { Pinecone, QueryResponse, RecordMetadata } from "@pinecone-database/pinecone";
import OpenAI from "openai";
import crypto from "crypto";
import { timeStamp } from "console";
import { NewsArticle } from "../types.js";


const openai = new OpenAI({
    apiKey: `${process.env.OPENAPI_API_KEY}`,
});
const pinecone = new Pinecone({ apiKey: `${process.env.PINECONE_API_KEY}` });
const index = pinecone.Index("finance-monitoring");


async function upsertNewsArticle(newsHash: string, article: NewsArticle, stockTicker: string) {
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: article.descriptionText,
    });

    const [{ embedding }] = embeddingResponse.data;

    await index.upsert([
        {
            id: newsHash,
            values: embedding,
            metadata: { 
                ticker: stockTicker,
                descriptionText: article.descriptionText,
                publishDate: String(article.publishDate),
                source: article.source 
            },
        }]);
}
  
async function isDuplicateNews(article: NewsArticle): Promise<boolean> {
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: article.descriptionText,
    });

    const [{ embedding }] = embeddingResponse.data;

    // search similar articles
    const queryResponse: QueryResponse<RecordMetadata> = await index.query({
        vector: embedding,
        topK: 1,
        includeMetadata: false,
    });

    return queryResponse.matches.length > 0 && (queryResponse.matches[0].score ?? 0) > 0.9;
}

export async function insertNewsArticle(article: NewsArticle, ticker: string) {
    if (await isDuplicateNews(article)) {
        console.log('Duplicate news article detected. Skipping insertion.');
        return;
    }

    await upsertNewsArticle(getNewsHash(article.descriptionText), article, ticker);
}



export async function searchTickerNews(query: string, topK: number = 5, stockTicker: string) {
    const index = pinecone.Index("finance-monitoring");
    
    const queryVector = await generateEmbedding(query);
    
    // hybrid search with metadata filtering
    const queryResponse = await index.query({
      vector: queryVector, // Use the generated query vector for semantic search
      topK: topK, // Number of results to retrieve
      includeMetadata: true, // Include metadata in the results
      filter: {
        ticker: stockTicker, 
      },
    });
  

    // Sorts by both relevance score and recency
    const sortedNews = queryResponse.matches
      .map((match) => ({
        source: String(match.metadata?.source),
        publishDate: Number(match.metadata?.publishDate), 
        descriptionText: String(match.metadata?.descriptionText),
        score: Number(match.score ?? 0)
      })).sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score; // Higher score first
        }
        return b.publishDate - a.publishDate; // Newer articles first
      });
      console.log(sortedNews.length);
    return sortedNews;
  }
  

function getNewsHash(content: string): string {
    return crypto.createHash("sha256").update(content).digest("hex");
}

async function generateEmbedding(query: string): Promise<number[]> {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-large",
      input: query,
    });
    return response.data[0].embedding;
  }

//Similar articles based on query - not used
async function querySimilarNews(query: string) {
    const embeddingResponse = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: query,
    });

    const [{ embedding }] = embeddingResponse.data;

    // Query Pinecone
    const queryResponse: QueryResponse<RecordMetadata> = await index.query({
        vector: embedding,
        topK: 5,
        includeMetadata: true,
    });

    return queryResponse.matches.map(match => match.metadata?.content);
}