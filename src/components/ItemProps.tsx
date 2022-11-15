export interface ItemProps {
    _id?: string;
    foodName: string;
    price: number;
    dateBought: Date;
    onSale: boolean;
    latitude: number;
    longitude: number;
}
