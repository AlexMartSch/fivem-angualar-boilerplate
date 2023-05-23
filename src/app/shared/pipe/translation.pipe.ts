import { Pipe, PipeTransform } from "@angular/core";
import { NativeService } from "../services/native.service";

@Pipe({name: 'translate'})
export class TranslationPipe implements PipeTransform {
    
    constructor(private nativeService: NativeService){}

    transform(value: any): string {
        if(!value) return "NO_TRANSLATION_FOUND";

        const translateString = this.nativeService.getAppSettings().translations[value]
        if(!translateString) return "NO_TRANSLATION__"+value

        return translateString
    }
}