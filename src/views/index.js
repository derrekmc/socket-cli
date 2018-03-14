module.exports = {
    pipe: function(viewName, data){
        return require('./' + viewName).index(data);
    }
};