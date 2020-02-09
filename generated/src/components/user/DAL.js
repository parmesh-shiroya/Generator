const __GENERATOR__SCHEMA_NAME__ = require("model")

class DAL {

    async insert(data) {
        return new __GENERATOR__SCHEMA_NAME__(data).save();
    }

    async getOne(filter = {}) {
        return __GENERATOR__SCHEMA_NAME__.findOne(filter);
    }


    async getAll(filter = {}) {
        return __GENERATOR__SCHEMA_NAME__.find(filter);
    }

    async delete(filter) {
        return __GENERATOR__SCHEMA_NAME__.deleteOne(filter)
    }

    async update(filter, data) {
        return __GENERATOR__SCHEMA_NAME__.findOneAndUpdate(filter, {
            $set: data
        }, { new: true });
    }
}



module.exports = new DAL();