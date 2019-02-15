import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "capitalize" })
export class CapitalizePipe implements PipeTransform {
  transform(value: any) {
    if (value) {
      let str = value.substring(0, 17).toLowerCase().split(" ")
      return str
        .map(function(word) {
          if(word == "") {
            return word[0];
          }
          return word[0].toUpperCase() + word.substr(1);
        })
        .join(" ");
    }
  }
}
