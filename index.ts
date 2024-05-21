const world = 'world';
import fs from 'fs'
export function hello(who: string = world): string {
    console.log(fs)
    return `Hello ${who}! `;
}