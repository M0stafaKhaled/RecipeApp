import axois from 'axios';
export default class Search {

    constructor(query){

        this.query = query;
    }

    

    async  getResult(){

    const key = '4d84391ed5520ac19b3c8fa5677bd3dd';
    try{
    const res  = await axois(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
          this.result= res.data.recipes;
          
   
    }
    catch(error){

        alert(error);

    }
    

}





}
