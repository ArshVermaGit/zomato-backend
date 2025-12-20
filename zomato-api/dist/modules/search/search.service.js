"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const algoliasearch_1 = __importDefault(require("algoliasearch"));
let SearchService = class SearchService {
    configService;
    client;
    restaurantIndex;
    dishIndex;
    constructor(configService) {
        this.configService = configService;
        const appId = this.configService.get('ALGOLIA_APP_ID');
        const apiKey = this.configService.get('ALGOLIA_API_KEY');
        if (appId && apiKey) {
            this.client = (0, algoliasearch_1.default)(appId, apiKey);
            this.restaurantIndex = this.client.initIndex('restaurants');
            this.dishIndex = this.client.initIndex('dishes');
        }
        else {
            console.warn('Algolia credentials missing.');
        }
    }
    async onModuleInit() {
        if (!this.client)
            return;
        try {
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
            await this.dishIndex.setSettings({
                searchableAttributes: ['name', 'description', 'category'],
                attributesForFaceting: ['category', 'price', 'isVeg', 'restaurantId'],
            });
        }
        catch (e) {
            console.error('Algolia settings init failed:', e);
        }
    }
    async searchRestaurants(query, filters) {
        if (!this.client)
            return { hits: [] };
        return this.restaurantIndex.search(query, {
            filters: filters,
        });
    }
    async searchDishes(query, filters) {
        if (!this.client)
            return { hits: [] };
        return this.dishIndex.search(query, {
            filters: filters,
        });
    }
    async indexRestaurant(restaurant) {
        if (!this.client)
            return;
        const objectID = restaurant.id;
        const { partner: _partner, ...rest } = restaurant;
        await this.restaurantIndex.saveObject({
            objectID,
            ...rest,
            _geoloc: restaurant.location
                ? { lat: restaurant.location.lat, lng: restaurant.location.lng }
                : undefined,
        });
    }
    async removeRestaurant(restaurantId) {
        if (!this.client)
            return;
        await this.restaurantIndex.deleteObject(restaurantId);
    }
    async indexDish(dish) {
        if (!this.client)
            return;
        const objectID = dish.id;
        await this.dishIndex.saveObject({ ...dish, objectID });
    }
    async removeDish(dishId) {
        if (!this.client)
            return;
        await this.dishIndex.deleteObject(dishId);
    }
};
exports.SearchService = SearchService;
exports.SearchService = SearchService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], SearchService);
//# sourceMappingURL=search.service.js.map