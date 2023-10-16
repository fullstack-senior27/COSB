const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const config = require('./config');
const { tokenTypes } = require('./tokens');
const { User, Beautician, Admin } = require('../models');

const jwtOptions = {
  secretOrKey: config.jwt.secret,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

const jwtVerify = async (payload, done) => {
  try {
    // console.log(payload);
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    console.log(payload);
    const user = await User.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.log(error);
    done(error, false);
  }
};

const beauticianJwtVerify = async (payload, done) => {
  try {
    // console.log(payload);
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    // console.log(payload);
    const user = await Beautician.findById(payload.sub);
    console.log(user);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.log("error: ", error);
    done(error, false);
  }
}

const adminJwtVerify = async (payload, done) => {
  try {
    // console.log(payload);
    if (payload.type !== tokenTypes.ACCESS) {
      throw new Error('Invalid token type');
    }
    console.log(payload);
    const user = await Admin.findById(payload.sub);
    if (!user) {
      return done(null, false);
    }
    done(null, user);
  } catch (error) {
    console.log("error: ", error);
    done(error, false);
  }
}

const jwtStrategy = new JwtStrategy(jwtOptions, jwtVerify);
const beauticianJwtStrategy = new JwtStrategy(jwtOptions, beauticianJwtVerify);
const adminJwtStrategy = new JwtStrategy(jwtOptions, adminJwtVerify);

module.exports = {
  jwtStrategy,
  beauticianJwtStrategy,
  adminJwtStrategy
};
