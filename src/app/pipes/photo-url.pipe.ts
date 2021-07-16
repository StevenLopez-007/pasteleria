import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photoUrl'
})
export class PhotoUrlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
