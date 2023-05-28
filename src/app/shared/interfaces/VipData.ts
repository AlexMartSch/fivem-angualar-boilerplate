export interface VipHistory {
    id          : number
    internalId  : string
    subject     : string
    price       : number
    status      : number
    buy_at      : Date
    synced?     : boolean
}

export interface VipPackage {
    InternalID  : string
    image       : string
    description : string
    prices      : {
        CLP?: number,
        USD?: number
    }
    credits     : number 
}


export interface VipData {
    history     : VipHistory[]
    packages    : VipPackage[]
    userData    : {
        email: string
        username: string
    }
    payments    : string[]
}

export interface PaymentMethod {
    id: string
    image: string
    isSelected?: boolean
}