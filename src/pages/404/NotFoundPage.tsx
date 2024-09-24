import deadComputer from '../../../public/images/icon/deadComputer.png'
import Image from 'next/image';


const NotFoundPage = () => {
    return (
        <div className={'h-screen bg-dark'}>
            <div className={'h-2/5'}/>
            <div className={'flex justify-center align-center items-end'}>
                <h3 className={'ml-[75px]'}>404 Not Found</h3>
                <Image src={deadComputer}
                       className={'mb-[-70px] ml-[40px]'}
                       alt="404"
                       quality={30}
                       width="200"
                       height="205"
                       priority={true}/>
            </div>
        </div>)
}

export default NotFoundPage