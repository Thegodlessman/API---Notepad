import { Strategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import config from '../config/config'
import user from "../models/user";

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWTSecret
}

export default new Strategy(opts, async(payload, done) => {
    try{
        const User = await user.findById(payload.id)

        if(User){
            return done(null, User);
        }

        return done(null, false)

    }catch(error){
        console.log(error)
    }
})