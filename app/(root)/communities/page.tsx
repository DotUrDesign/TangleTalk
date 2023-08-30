/*

Create Organisation --> Clicking "create organisation", its immediately going to open up a greate interface where we can simply upload a profile photo and enter the organisation name, a slide URL and we are good to go.

Question -> How is data from clerk going to get into our application instantly ?
            How we gonna append additional posts once they are made as part of our organisation ?

Answer -> To do all these stuffs, we have Webhooks waiting and listening for the events from clerk so we can then make additional actions and modify our database accordingly.

*/


const page = async () => {
    return (
      <section>
          <h1 className="head-text mb-10">Communities</h1>
      </section>
    )
  }
  
  export default page;