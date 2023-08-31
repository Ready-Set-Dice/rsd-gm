const { ProfileService } = require('@/../../.shared/backend/ProfileService')
const { PCService } = require('@/../../.shared/backend/PCService')
const { PartyService } = require('@/../../.shared/backend/PartyService')

const subdomain = 'gm'

class ServiceManager {
    constructor() {

    }

    init(prodDB, devDB, selectDB) {
        ProfileService.init(prodDB, devDB, subdomain)
        PartyService.init(prodDB, devDB, subdomain, selectDB)
        PCService.init(prodDB, devDB, subdomain, selectDB)

        PartyService.setPCService(PCService)
    }
}

module.exports.ServiceManager = new ServiceManager()

module.exports.ProfileService = ProfileService
module.exports.PartyService = PartyService
module.exports.PCService = PCService
module.exports.subdomain = subdomain