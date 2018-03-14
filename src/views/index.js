module.exports = {
    pipe: function(viewName, data){
        try{
            let view = require('./' + viewName).index(data);
            return view;
        }catch (e){
            return false;
        }
        
    }
};