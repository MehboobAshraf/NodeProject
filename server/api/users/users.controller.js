/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/userss              ->  index
 * POST    /api/userss              ->  create
 * GET     /api/userss/:id          ->  show
 * PUT     /api/userss/:id          ->  upsert
 * PATCH   /api/userss/:id          ->  patch
 * DELETE  /api/userss/:id          ->  destroy
 */

import { applyPatch } from 'fast-json-patch';
import Users from './users.model';
var _ = require('lodash');
import jwt from 'jsonwebtoken';
var Q = require('q');
var bcrypt = require('bcryptjs');

function respondWithResult(res, statusCode) {
    statusCode = statusCode || 200;
    return function(entity) {
        if(entity) {
            return res.status(statusCode).json(entity);
        }
        return null;
    };
}

function patchUpdates(patches) {
    return function(entity) {
        try {
            applyPatch(entity, patches, /*validate*/ true);
        } catch(err) {
            return Promise.reject(err);
        }

        return entity.save();
    };
}

function removeEntity(res) {
    return function(entity) {
        if(entity) {
            return entity.remove()
                .then(() => res.status(204).end());
        }
    };
}

function handleEntityNotFound(res) {
    return function(entity) {
        if(!entity) {
            res.status(404).end();
            return null;
        }
        return entity;
    };
}

function handleError(res, statusCode) {
    statusCode = statusCode || 500;
    return function(err) {
        res.status(statusCode).send(err);
    };
}

// Gets a list of Userss
export function index(req, res) {
    console.log('user called')
    return Users.find().exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Gets a single Users from the DB
export function show(req, res) {
    return Users.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Creates a new Users in the DB
// export function create(req, res) {
//     return Users.create(req.body)
//         .then(respondWithResult(res, 201))
//         .catch(handleError(res));
// }

// Upserts the given Users in the DB at the specified ID
export function upsert(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Users.findOneAndUpdate({_id: req.params.id}, req.body, {new: true, upsert: true, setDefaultsOnInsert: true, runValidators: true}).exec()
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Updates an existing Users in the DB
export function patch(req, res) {
    if(req.body._id) {
        Reflect.deleteProperty(req.body, '_id');
    }
    return Users.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(patchUpdates(req.body))
        .then(respondWithResult(res))
        .catch(handleError(res));
}

// Deletes a Users from the DB
export function destroy(req, res) {
    return Users.findById(req.params.id).exec()
        .then(handleEntityNotFound(res))
        .then(removeEntity(res))
        .catch(handleError(res));
}

export function create(req, res) {
    var deferred = Q.defer();
    // validation
    Users.findOne(
        { email: req.body.params.email },
        function (err, user) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            if (user) {
                // username already exists
                deferred.reject('Username "' + req.body.email + '" is already taken');
            } else {
                createUser(req.body.params);
            }
        });

    function createUser(userParam) {
    console.log('user', req.body.params)

        // set user object to userParam without the cleartext password
        var user = _.omit(userParam, 'password');
        // add hashed password to user object
        user.hash = bcrypt.hashSync(userParam.password, 10);
        console.log('user: ' ,user)
         Users.create(
            user,
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);                
                deferred.resolve();
                return res.status(200).json({message:'user registered successfully'})
            })

    }
}
export function login(req, res) {
    var deferred = Q.defer();
    Users.findOne({ email: req.body.params.email }, function (err, user) {
        if (user && bcrypt.compareSync(req.body.params.password, user.hash)) {
            // authentication successful
            //  deferred.resolve({
            //     _id: user._id,
            //     email: user.email,
            //     name: user.name,
            //     token: jwt.sign({ sub: user._id }, config.secret),
            // });
            var token = jwt.sign({ _id: user._id }, "config.secrets.session", {
                expiresIn: 60 * 60 * 5
            });
            return res.status(200).json({token})
        } else {
            // authentication failed
            deferred.resolve();
        }
    });
    // return res.status(200).message({message: deferred.promise});
}
