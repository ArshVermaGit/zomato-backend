import { PromosService } from './promos.service';
export declare class PromosController {
    private promosService;
    constructor(promosService: PromosService);
    getAvailable(req: any, restaurantId: string): unknown;
    applyPromo(req: any, body: {
        code: string;
        cartValue: number;
        restaurantId: string;
    }): unknown;
    createPromo(body: any): unknown;
}
