export default function reserve( state = [], action){

    switch(action.type){
        case 'NAV_ARTICLE':
            return [ action.article ];
        default:
            return state;
    }
}