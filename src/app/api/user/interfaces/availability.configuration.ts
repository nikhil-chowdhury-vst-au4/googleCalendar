export enum AVAILABILITY_CONFIGURATION {
    minutes = 'minutes',
    hours = 'hours',
    weeks = 'weeks',
    months = 'months'
}

export interface AvailityConfigurationInterface {
    maxWindow?: number;
    periodType?: AVAILABILITY_CONFIGURATION;
    periodValue?: number;
}
