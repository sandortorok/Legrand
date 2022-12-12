import { Injectable } from '@angular/core';

import * as XLSX from 'xlsx';

const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {
    constructor() { }
    public exportAsExcelFile(json: any[], excelFileName: String): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        XLSX.writeFile(workbook, excelFileName + EXCEL_EXTENSION);
    }
}