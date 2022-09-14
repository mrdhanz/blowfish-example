import Blowfish from "blowfish-node";

const bf = new Blowfish('super key', Blowfish.MODE.CBC, Blowfish.PADDING.PKCS5); // only key isn't optional
bf.setIv('abcdefgh'); // optional for ECB mode; bytes length should be equal 8

const encoded = bf.encode('input text even with emoji 🎅');
console.info('encoded', encoded);
const decoded = bf.decode(encoded, Blowfish.TYPE.STRING); // type is optional
console.warn('decoded', decoded); // input text even with emoji 🎅
// encode the object to base64
const encodeds = bf.encodeToBase64(JSON.stringify({message: 'super secret response api'}));
console.info('encodeds', encodeds);
const response = bf.decode(encodeds, Blowfish.TYPE.JSON_OBJECT); // type is required to JSON_OBJECT
console.warn('response', response);

// example fetch response with blowfish-node
import axios from 'axios';
const axiosBF = axios.create({
    responseType: 'text',
    transformResponse: [
        (data) => {
            if(typeof data === 'string'){
                try {
                    return bf.decode(data, Blowfish.TYPE.JSON_OBJECT);
                } catch (error) {
                    return data;
                }
            }
            return data;
        },
    ],
});
const fetch = async () => {
    try {
    const {data} = await axiosBF.get('https://gist.github.com/mrdhanz/c300fdbea4c57228bf83ea74a3bbf57a/raw/a6eb55f9c6e523473ed952314888f81d18929656/encrypted.txt');
    console.warn('response2', data);
    } catch (error) {
        console.error(error);
    }
}

fetch();