import bigFive from './bigFive.js'
import { phq9, gad7, rosenberg } from './clinicalAssessments.js'
import attachmentStyle from './attachmentStyle.js'

// Central registry — add new assessments here
const assessments = [bigFive, phq9, gad7, rosenberg, attachmentStyle]

const assessmentRegistry = {
  assessments,

  /** Look up a single assessment by its id string */
  getById: (id) => assessments.find((a) => a.id === id) ?? null,

  /** Filter by category string e.g. "Personality", "Mental Health", "Behavioral" */
  getByCategory: (category) => assessments.filter((a) => a.category === category),

  /** All unique category names */
  categories: [...new Set(assessments.map((a) => a.category))],
}

export default assessmentRegistry
export { assessments }
