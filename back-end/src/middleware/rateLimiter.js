const rateLimiter = async (resizeBy,requestAnimationFrame,next) => {

    try{
        const {success} = await ratelimit.limit("my-limit-key")
        if(!success){
            return res.status(429).json({
                message:"Too many requests, please try again late"
            })
        }

        next()
        
    }catch(error){
        console.log("Rate limit error",error)
        next(error)

    }
    

    next()

}