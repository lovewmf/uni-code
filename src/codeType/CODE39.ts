import {encodings, characters} from '../common/metadata'

export class CODE39 {

    private code: string

    constructor(codes: string){
		this.code = codes;
	}
	encode(): string{
		let result = getEncoding("*");
		for(let i = 0; i < this.code.length; i++){
			result += getEncoding(this.code[i]) + "0";
		}
		result += getEncoding("*");

		return result;
	}
}

const getEncoding = function(character: string){

	return getBinary(characterValue(character));
}

const getBinary = function (characterValue: number){
	return encodings[characterValue].toString(2);
}

// const getCharacter = function (characterValue: string){
// 	return characters[characterValue];
// }

const characterValue = function (character: string){
	return characters.indexOf(character);
}