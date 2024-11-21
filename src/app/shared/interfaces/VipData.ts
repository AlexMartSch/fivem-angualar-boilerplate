export interface VipHistory {
    id          : number
    orderId     : string
    internalId  : string
    subject     : string
    price       : number
    status      : number
    currency    : string
    buy_at      : Date
    synced?     : boolean
}

export interface VipPackage {
    InternalID      : string
    image           : string
    description     : string
    prices          : {
        CLP?    : number,
        USD?    : number,
        CREDITS? : number
    }
    credits         : number
    limit?          : number
    globalLimit?    : number
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