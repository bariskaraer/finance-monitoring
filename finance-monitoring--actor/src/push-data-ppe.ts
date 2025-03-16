import { Actor } from 'apify';

import { ChargingManager } from './charging-manager.js';
import type { EventId } from './main.js';

export const pushDataPPEAware = async (
    items: Parameters<Actor['pushData']>[0],
    eventId: EventId,
): Promise<{ eventChargeLimitReached: boolean, pushedItemCount: number }> => {
    const itemsAsArray = Array.isArray(items) ? items : [items];
    // First we attempt to charge event for each item, we use the items as metadata for the event
    const { chargedCount, eventChargeLimitReached } = await ChargingManager.charge<EventId>(eventId, itemsAsArray);

    // We always use the PPR aware push so that it works when we transition from PPR to PPE
    // If it is already PPE, this behaves like normal Actor.pushData
    // We must push only the amount we were able to charge for, otherwise we are giving free results
    const { shouldStop, pushedItemCount } = await pushDataPPRMaxAware(items.slice(0, chargedCount));

    return {
        eventChargeLimitReached: eventChargeLimitReached || shouldStop,
        pushedItemCount,
    };
};

// All below is just old PPR code that we use for the transition from PPR to PPE
const MAX_ITEMS: number | undefined = Number(process.env.ACTOR_MAX_PAID_DATASET_ITEMS) || undefined;

let isInitialized = false;
let isGettingItemCount = false;
let pushedItemCount = 0;

const pushDataPPRMaxAware = async (data: Parameters<Actor['pushData']>[0]): Promise<{ shouldStop: boolean, pushedItemCount: number }> => {
    const dataAsArray = Array.isArray(data) ? data : [data];
    // If this isn't pay-per-result, we just push like normally
    if (!MAX_ITEMS) {
        await Actor.pushData(dataAsArray);
        return { shouldStop: false, pushedItemCount: dataAsArray.length };
    }

    // We initialize on the first call so that we can use it as standalone function
    // Only the first handler calling pushData() will initialize the count
    if (!isInitialized && !isGettingItemCount) {
        isGettingItemCount = true;
        const dataset = await Actor.openDataset();
        const { itemCount } = (await dataset.getInfo())!;
        pushedItemCount = itemCount;
        isGettingItemCount = false;
        isInitialized = true;
    }

    // Others handlers will wait until initialized which should be few milliseconds anyway
    while (!isInitialized) {
        await new Promise((resolve) => setTimeout(resolve, 50));
    }

    const dataToPush = dataAsArray.slice(0, MAX_ITEMS - pushedItemCount);

    if (dataToPush.length) {
        // We have to update the state before 'await' to avoid race conditions
        pushedItemCount += dataToPush.length;
        await Actor.pushData(dataToPush);
    }

    return { shouldStop: pushedItemCount >= MAX_ITEMS, pushedItemCount };
};