import { CWError } from './error'
const _ = require('lodash')

import { CaseData } from './case_data'
import { CaseFinancial } from './case_financial'
import { CaseWorkflow} from './case_workflow'

export class Case {
  /**
   * @hidden
   */
  cw: any


  /**
   * Data Detail methods
   */
  data?: Object
  /**
   * Workflow & task methods
   */
  workflow?: Object
  /**
   * Payment, Receipt, & Fee methods
   */
  financial?: Object

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
    this.data = new CaseData(cw)
    this.workflow = new CaseWorkflow(cw)
    this.financial = new CaseFinancial(cw)
  }

}
