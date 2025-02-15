import { Link } from "react-router-dom";

function Category(){

    return <>
      <div className="category-card">
      <div >
        
        
        <Link to={`/categorybeauty`}>
        <img src="https://t4.ftcdn.net/jpg/02/73/55/33/360_F_273553300_sBBxIPpLSn5iC5vC8FwzFh6BJDKvUeaC.jpg" alt='Beauty'>
        </img>
        </Link>
        <h3>Beauty</h3>
      </div>
      <div >
        
        <Link to='/categoryfragrances'>
        <img src="https://markdesvince.com/cdn/shop/collections/mark-des-vince-perfumes-collection.jpg?v=1714202246&width=3840" alt='fragrances'>
        </img>
        </Link>
        <h3>Fragrances</h3>
    
      </div>
      <div >
        
       <Link to='/categorygroceries'>
       <img src="https://hips.hearstapps.com/hmg-prod/images/healthy-groceries-bag-66eaef810acf6.jpg?crop=0.564xw:1.00xh;0.295xw,0&resize=1200:*" alt='groceries'>
       </img>
       </Link>
        <h3>
        Groceries

        </h3>
      </div>
      <div >
        <Link to='/categoryfurniture'>
        <img src="https://media.istockphoto.com/id/968086564/photo/wooden-chairs-at-table-in-bright-open-space-interior-with-lamp-next-to-grey-couch-real-photo.jpg?s=612x612&w=0&k=20&c=TfE8sZbX_XC4yIYEaRAJHrdIWjZqvRx3Crn0ygcr-h0=" alt='Furniture'>
        </img>
        </Link>
        <h3>
        Furniture
        </h3>
      </div>
      </div>

    </>
}

export default Category;