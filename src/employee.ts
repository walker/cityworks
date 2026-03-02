import { CWError } from './error'
const _ = require('lodash')

/**
 * A plugin that contains "general" methods for a Cityworks install
 */
export class Employee {
  /**
   * @hidden
   */
  cw: any

  /**
   * @hidden
   */
  constructor(cw) {
    this.cw = cw
  }

  
  /**
   * Add a new employee
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  add() {
    return new Promise((resolve, reject) => {
    })
  }

  /**
   * Add a new employee
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @return {Object} Returns Promise object that represents an object that is the updated user
   */
  update() {
    return new Promise((resolve, reject) => {
    })
  }

  /**
   * Add a licenses to an employee
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  addLicenses() {
    return new Promise((resolve, reject) => {
    })
  }

  /**
   * Delete licenses from an employee
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  deleteLicenses() {
    return new Promise((resolve, reject) => {
    })
  }

  /**
   * Get al employees
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  all(inactive: boolean = false) {
    return new Promise((resolve, reject) => {
    })
  }

  /**
   * Get the employees in the group with the given group ID.
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  byGroup() {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Get employee by ID
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getById() {
    return new Promise((resolve, reject) => {
      // Call byIds
    })
  } 

  /**
   * Get employees by IDs
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getByIds() {
    return new Promise((resolve, reject) => {
      // Call byIds
    })
  } 

  /**
   * Delete by ID
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  delete() {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Get groups that given employees are member of by employee sid.
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  getGroupsByEmployeeSid() {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Check names for uniqueness
   *
   * @param {Array<string>} namesToCheck - an array list of the names (strings) to check for uniqueness
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  checkNames(names: Array<string>) {
    return new Promise((resolve, reject) => {
    })
  } 

  /**
   * Search for employees
   *
   * @param {Array<string>} namesToCheck - an array list of the names (strings) to check for uniqueness
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  search() {
    return new Promise((resolve, reject) => {
    })
  } 
  /**
   * Get employee custom data fields by id
   *
   * @param {string} activityType - which activity type the following ID will be for.
   * @param {number} activityId - activity Case or CaseTask (task instance) ID to check
   * @return {Object} Returns Promise object that represents an object that is the newly-added user
   */
  customDataFields() {
    return new Promise((resolve, reject) => {
    })
  } 

  
}