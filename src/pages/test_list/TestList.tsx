import React, { useEffect, useState } from 'react';
import NavBar from '@/components/common/navbar';
import { getCatImgs } from '@/app/api/health/route';
import { CatImg } from '@/assets/commonTypes/catImg';
import { ImageList, ImageListItem } from '@mui/material';
import Image from 'next/image';

const TestListPage = () => {
  const [catImgData, setCatImgData] = useState<CatImg[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getCatImgs();
        setCatImgData(data);
      } catch (error) {
        console.error('Error fetching cat images:', error);
      }
    };
    fetchData().then();
  }, []);

  const srcset = (catImg: CatImg) => {
    return {
      src: `${catImg.url}?w=${catImg.width}&h=${catImg.height}&fit=crop&auto=format`,
      srcSet: `${catImg.url}?w=${catImg.width}&h=${catImg.height}&fit=crop&auto=format&dpr=2 2x`,
    };
  };

  return (
    <div className={'w-full m-auto p-auto min-w-[1000px]'}>
      <div className={'m-auto p-auto w-[1000px] h-[600px]'}>
        <ImageList
          sx={{ width: 1000, height: 450 }}
          variant="quilted"
          cols={5}
          rowHeight={121}
        >
          {catImgData.map((item) => (
            <ImageListItem key={item.url}>
              <Image
                src={item.url}
                width={item.width}
                height={item.height}
                priority={true}
                alt={item.id}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
      <NavBar />
    </div>
  );
};

export default TestListPage;
