import { Input } from 'antd'

const { Search } = Input;// 解构出 Search 组件  input 下的子组件

function Header(){

    const onSearch = (value: string) => console.log(value);
    return(
    <>
        <div className="flex flex-col items-center justify-center w-full h-20 fixed top-0 bg-white px-4 z-50">
        <Search 
         placeholder="Search"
         onSearch={onSearch}
         enterButton
         allowClear
         style={{ width: '90%' }}
        //  className='w-4/5'
         />
        </div>
    </>
    )
}

export default Header