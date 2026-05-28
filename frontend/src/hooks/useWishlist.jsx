import { useDispatch, useSelector } from 'react-redux';
import {
    toggleWishlist,
    removeOne,
    toggleSelect,
    clearSelected,
    clearAll
} from '../store/slices/wishlistSlice';

export const useWishlist = () => {
    const dispatch = useDispatch();
    const { items, selectedIds } = useSelector((state) => state.wishlist);

    const handleToggleWishlist = (product) => {
        dispatch(toggleWishlist(product));
    };

    const handleRemoveOne = (id) => {
        dispatch(removeOne(id));
    };

    const handleToggleSelect = (id) => {
        dispatch(toggleSelect(id));
    };

    const handleClearSelected = () => {
        dispatch(clearSelected());
    };

    const handleClearAll = () => {
        dispatch(clearAll());
    };

    const isWishlisted = (id) => {
        return items.some((item) => item.id === id);
    };

    const isSelected = (id) => {
        return selectedIds.includes(id);
    };

    return {
        wishlistItems: items,
        selectedIds,
        wishlistCount: items.length,
        selectedCount: selectedIds.length,
        toggleWishlist: handleToggleWishlist,
        removeOne: handleRemoveOne,
        toggleSelect: handleToggleSelect,
        clearSelected: handleClearSelected,
        clearAll: handleClearAll,
        isWishlisted,
        isSelected
    };
};