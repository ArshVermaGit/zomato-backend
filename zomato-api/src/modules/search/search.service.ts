import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import algoliasearch, { SearchClient, SearchIndex } from 'algoliasearch';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: SearchClient;
  private restaurantIndex: SearchIndex;
  private dishIndex: SearchIndex;

  constructor(private configService: ConfigService) {
    const appId = this.configService.get<string>('ALGOLIA_APP_ID');
    const apiKey = this.configService.get<string>('ALGOLIA_API_KEY');

    if (appId && apiKey) {
      this.client = algoliasearch(appId, apiKey);
      this.restaurantIndex = this.client.initIndex('restaurants');
      this.dishIndex = this.client.initIndex('dishes');
    } else {
      console.warn('Algolia credentials missing.');
    }
  }

  async onModuleInit() {
    if (!this.client) return;

    try {
      // Configure Restaurants Index
      await this.restaurantIndex.setSettings({
        searchableAttributes: [
          'name',
          'cuisineTypes',
          'address',
          'description',
        ],
        attributesForFaceting: [
          'cuisineTypes',
          'rating',
          'deliveryFee',
          'isActive',
        ],
        customRanking: ['desc(rating)'],
      });

      // Configure Dishes Index
      await this.dishIndex.setSettings({
        searchableAttributes: ['name', 'description', 'category'],
        attributesForFaceting: ['category', 'price', 'isVeg', 'restaurantId'],
      });
    } catch (e) {
      console.error('Algolia settings init failed:', e);
    }
  }

  async searchRestaurants(query: string, filters?: string) {
    if (!this.client) return { hits: [] };
    return this.restaurantIndex.search(query, {
      filters: filters, // e.g., "cuisineTypes:Italian AND rating >= 4"
    });
  }

  async searchDishes(query: string, filters?: string) {
    if (!this.client) return { hits: [] };
    return this.dishIndex.search(query, {
      filters: filters,
    });
  }

  // Sync Methods
  async indexRestaurant(restaurant: any) {
    if (!this.client) return;
    const objectID = restaurant.id;
    // removing sensitive/circular data before indexing
    const { partner: _partner, ...rest } = restaurant;
    await this.restaurantIndex.saveObject({
      objectID,
      ...rest,
      _geoloc: restaurant.location
        ? { lat: restaurant.location.lat, lng: restaurant.location.lng }
        : undefined,
    });
  }

  async removeRestaurant(restaurantId: string) {
    if (!this.client) return;
    await this.restaurantIndex.deleteObject(restaurantId);
  }

  async indexDish(dish: any) {
    if (!this.client) return;
    const objectID = dish.id;
    await this.dishIndex.saveObject({ ...dish, objectID });
  }

  async removeDish(dishId: string) {
    if (!this.client) return;
    await this.dishIndex.deleteObject(dishId);
  }
}
