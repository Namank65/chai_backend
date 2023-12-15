const asyncHeandler = () => {

}


// Profectional code base aproch also like this...

// const asyncHeandler = () => {}
// const asyncHeandler = (func) => () => {}
// const asyncHeandler = (func) => {() => {}}        //kind of this function


/*
const asyncHeandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next);
    } catch (error) {
        console.log(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
};
*/