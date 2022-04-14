// JSON.parse(localStorage.getItem('localhost'))
export const initialState = {
    basket: [], 
    photo: [],
    dash: [],
};

export const getBasketTotal = (basket) =>
basket.reduce((amount, item) => item.price + amount, 0);

export const getCaparraTotal = (basket) => 
basket.reduce((amount, item) => item.caparra + amount, 0);


const reducer = (state, action) => {

    console.log(action);
    switch (action.type) {
        
        case 'ADD_TO_BASKET':

            return {
                ...state,
                basket: [...state.basket, action.item]
            };
        

        case 'CLEAR_BASKET':

        //alert('basket pulito')
                return {
                    ...state,
                    basket:[]
                };

        case "REMOVE_FROM_BASKET":

            const index = state.basket.findIndex(
                (basketItem) => basketItem.id === action.id
            );
            let newBasket = [...state.basket];

            if (index >= 0) {
                newBasket.splice(index, 1)
            } else {
                console.log('Impossibile rimuovere il prodotto (id:  ${action.id}) perchè non è presente nel carrello!')
            }

        default:
                return { ...state,
                    basket: newBasket
                }
            

        case "REMOVE_FROM_BOOK":
                return {
                    ...state,
                    photo: [...state.photo]
                };

                
        case "REMOVE_FROM_DASH" :
                    return {
                        ...state,
                        dash: [...state.dash]
                    };
    }
};

export default reducer;