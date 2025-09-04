import { makeIndex } from "./lib/utils.js";

const BASE_URL = 'https://webinars.webdev.education-services.ru/sp7-api';

export function initData(sourceData) {
    // переменные для кеширования данных
    let sellers;
    let customers;
    let lastResult;
    let lastQuery;

    // функция для приведения строк в нужный формат
    const mapRecords = (data) => data.map(item => ({
        id: item.receipt_id,
        date: item.date,
        seller: sellers?.[item.seller_id] ?? `Unknown seller (${item.seller_id})`,
        customer: customers?.[item.customer_id] ?? `Unknown customer (${item.customer_id})`,
        total: item.total_amount
    }));

    // функция получения индексов
    const getIndexes = async () => {
        if (!sellers || !customers) { // если индексы ещё не установлены, делаем запросы
            [sellers, customers] = await Promise.all([
                fetch(`${BASE_URL}/sellers`).then(res => res.json()),
                fetch(`${BASE_URL}/customers`).then(res => res.json()),
            ]);
        }
        return { sellers, customers };
    };

    // функция получения записей о продажах
    const getRecords = async (query, isUpdated = false) => {
    // загрузка индексов, если ещё не загружены
    if (!sellers || !customers) {
        [sellers, customers] = await Promise.all([
            fetch(`${BASE_URL}/sellers`).then(res => res.json()),
            fetch(`${BASE_URL}/customers`).then(res => res.json()),
        ]);
    }

    const qs = new URLSearchParams(query);
    const nextQuery = qs.toString();

    if (lastQuery === nextQuery && !isUpdated) {
        return lastResult; 
    }

    const response = await fetch(`${BASE_URL}/records?${nextQuery}`);
    const records = await response.json();

    lastQuery = nextQuery;


    lastResult = {
        total: records.total,
        items: records.items.map(item => ({
            id: item.receipt_id,
            date: item.date,
            seller: sellers[item.seller_id] ?? `Unknown seller (${item.seller_id})`,
            customer: customers[item.customer_id] ?? `Unknown customer (${item.customer_id})`,
            total: item.total_amount
        }))
    };

    return lastResult;
};

    return {
        getIndexes,
        getRecords
    };
}