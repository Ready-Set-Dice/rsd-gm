import {BestiaryController} from '@root/.shared/controllers/BestiaryController'
import {BottomSheetController} from '@root/.shared/controllers/BottomSheetController'
import {BuildController} from '@root/.shared/controllers/BuildController'
import {CampaignsController} from '@root/.shared/controllers/CampaignsController'
import {CombatController} from '@root/.shared/controllers/CombatController'
import {ConditionsController} from '@root/.shared/controllers/ConditionsController'
import {DialogController} from '@root/.shared/controllers/DialogController'
import {EncountersController} from '@root/.shared/controllers/EncountersController'
import {FormatController} from '@root/.shared/controllers/FormatController'
import {MembersController} from '@root/.shared/controllers/MembersController'
import {SettingsController} from '@root/.shared/controllers/SettingsController'
import {SpellsController} from '@root/.shared/controllers/SpellsController'
import {StaticController} from '@root/.shared/controllers/StaticController'
import {RandomController} from '@root/.shared/controllers/RandomController'
import {EventHistoryController} from '@root/.shared/controllers/EventHistoryController'
const isDev = process.env.NODE_ENV !== "development" ? false : true

export const $rsd = {
    bestiary: new BestiaryController(isDev),
    bottomsheet: new BottomSheetController(isDev),
    build: new BuildController(isDev),
    campaigns: new CampaignsController(isDev),
    combat: new CombatController(isDev),
    conditions: new ConditionsController(isDev),
    dialog: new DialogController(isDev),
    encounters: new EncountersController(isDev),
    format: new FormatController(isDev),
    members: new MembersController(isDev),
    settings: new SettingsController(isDev),
    spells: new SpellsController(isDev),
    static: new StaticController(isDev),
    random: new RandomController(isDev),
    eventhistory: new EventHistoryController(isDev),
}

Object.values($rsd).forEach(controller => {
    controller.setFB($rsd)
})