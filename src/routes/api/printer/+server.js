import { error } from '@sveltejs/kit';
import net from 'node:net'
import escpos from 'escpos';
import escposNetwork from 'escpos-network';

/** @type {import('./$types').RequestHandler} */
export function GET({ url }) {
    const device = new escposNetwork('192.168.1.100', 9100);
    const printer = new escpos.Printer(device);

    device.open(function () {
        printer
            .font('a')
            .align('ct')
            .style('bu')
            .size(1, 1)
            .text('The quick brown fox jumps over the lazy dog')
            .text('敏捷的棕色狐狸跳过懒狗')
            .barcode('1234567', 'EAN8')
            .table(["One", "Two", "Three"])
            .tableCustom(
                [
                    { text: "Left", align: "LEFT", width: 0.33, style: 'B' },
                    { text: "Center", align: "CENTER", width: 0.33 },
                    { text: "Right", align: "RIGHT", width: 0.33 }
                ],
                { encoding: 'cp857', size: [1, 1] } // Optional
            )
            .qrimage('https://github.com/song940/node-escpos', function (err) {
                printer.cut();
                printer.close();
            });
    })

    return new Response(String("random"));
}