import {rules, createComparison} from "../lib/compare.js";

function searchTotalInRange(minStr, maxStr) {
    const min = parseFloat(minStr);
    const max = parseFloat(maxStr);

    return (item) => {
        const value = parseFloat(item.total);
        if (!isNaN(min) && value < min) return false;
        if (!isNaN(max) && value > max) return false;
        return true;
    };
}




export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор

    return (data, state, action) => {
        if(!state[searchField] && !state.totalFrom && !state.totalTo) {
            return data;
        }
        // @todo: #5.2 — применить компаратор
        const searchRule = state[searchField] ? rules.searchMultipleFields(state[searchField], ['date', 'customer', 'seller'], false) : () => true;
    const totalRule = searchTotalInRange(state.totalFrom || '', state.totalTo || '');
    return data.filter(item => searchRule(item) && totalRule(item));
    }
}