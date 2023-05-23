export interface Settings {

    asAdmin: boolean;

    refreshInterval: number;
    language: string;

    scriptName: string;
    categories: string[];
    states: Array<{status: number, label: string}>
    actions: Array<{
        label: string,
        icon: string,
        internalId: string,
    }>,
    translations: any
}