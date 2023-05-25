import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'gradeListSlicer'
})
export class GradeListSlicerPipe implements PipeTransform {

  transform(value: string | null, undefined, maxLength): {gradeList: string, isSliced: boolean}{

    if (!value) return {gradeList: '', isSliced: false}

    const isSliced = value.length>maxLength;
    const gradeList = isSliced ? value.slice(0,maxLength).trim() + '...' : value;

    return {gradeList,isSliced};
  }

}
