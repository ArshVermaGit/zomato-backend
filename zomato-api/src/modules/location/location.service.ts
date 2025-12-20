import { Injectable, Inject } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class LocationService {
  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {}

  async updateDriverLocation(driverId: string, lat: number, lng: number) {
    const key = `driver:location:${driverId}`;
    const data = JSON.stringify({ lat, lng, timestamp: Date.now() });
    // Store with 60s TTL
    await this.redis.set(key, data, 'EX', 60);
    return { success: true };
  }

  async getDriverLocation(driverId: string) {
    const key = `driver:location:${driverId}`;
    const data = await this.redis.get(key);
    return data ? JSON.parse(data) : null;
  }
}
