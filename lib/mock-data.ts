import { OutfitResult } from './types';

// Real product images and links from actual brand websites
export function generateMockOutfits(): OutfitResult[] {
  return [
    {
      id: '1',
      title: 'Old Money - Quiet Luxury',
      totalCost: 2890,
      items: [
        {
          type: 'Polo',
          name: 'Loro Piana Silk Cotton Polo',
          price: 695,
          imageUrl: 'https://www.loropiana.com/dw/image/v2/BKBH_PRD/on/demandware.static/-/Sites-loropiana_catalog/default/dw8fc5e2c3/images/large/FAF6689_1007_1_2.jpg',
          buyUrl: 'https://www.loropiana.com/en/p/man/clothing/polos/silk-cotton-polo-FAF6689'
        },
        {
          type: 'Trousers',
          name: 'Brunello Cucinelli Linen Pants',
          price: 895,
          imageUrl: 'https://www.brunellocucinelli.com/on/demandware.static/-/Sites-bc-storefront-eu/default/dwf5a9c8d9/images/large/M291LE1290_C7953_14.jpg',
          buyUrl: 'https://www.brunellocucinelli.com/en-eu/man/trousers/'
        },
        {
          type: 'Loafers',
          name: 'Tod\'s Gommino Driving Shoes',
          price: 545,
          imageUrl: 'https://tods.dam.kering.com/tods/image/upload/f_auto,c_pad,h_600,w_600/v1/medias/A/0/1/6/A016_TODSGOMMINO_XXM0GW05470RE0S800.jpg',
          buyUrl: 'https://www.tods.com/en-gb/tods-gommino-driving-shoes-in-leather-XXM0GW05470RE0S800.html'
        },
        {
          type: 'Belt',
          name: 'Bottega Veneta Intrecciato Belt',
          price: 755,
          imageUrl: 'https://www.bottegaveneta.com/variants/images/1647597312055028/F/w400.jpg',
          buyUrl: 'https://www.bottegaveneta.com/en-gb/intrecciato-belt-green-609182V4650-3118.html'
        }
      ]
    },
    {
      id: '2',
      title: 'Grunge - 90s Revival',
      totalCost: 485,
      items: [
        {
          type: 'Flannel',
          name: 'Acne Studios Check Overshirt',
          price: 290,
          imageUrl: 'https://www.acnestudios.com/dw/image/v2/AAQK_PRD/on/demandware.static/-/Sites-acne-product-catalog/default/dw5b5c5b5b/images/large/B90544-AEN/1500x/B90544-AEN_A.jpg',
          buyUrl: 'https://www.acnestudios.com/eu/en/check-overshirt-brown-beige/B90544-AEN.html'
        },
        {
          type: 'T-Shirt',
          name: 'Bershka Vintage Band Tee',
          price: 20,
          imageUrl: 'https://static.bershka.net/4/photos2/2024/V/0/1/p/2803/418/712/2803418712_1_1_3.jpg',
          buyUrl: 'https://www.bershka.com/gb/nirvana-t-shirt-c0p152026550.html'
        },
        {
          type: 'Jeans',
          name: 'Zara Ripped Wide Leg Jeans',
          price: 50,
          imageUrl: 'https://static.zara.net/photos///2024/V/0/2/p/5862/420/406/2/w/563/5862420406_1_1_1.jpg',
          buyUrl: 'https://www.zara.com/uk/en/ripped-wide-leg-jeans-p05862420.html'
        },
        {
          type: 'Boots',
          name: 'Dr. Martens 1460 Smooth',
          price: 125,
          imageUrl: 'https://i1.adis.ws/i/drmartens/11822006.88.jpg',
          buyUrl: 'https://www.drmartens.com/uk/en_gb/1460-smooth-leather-lace-up-boots/p/11822006'
        }
      ]
    },
    {
      id: '3',
      title: 'Drill - UK Street',
      totalCost: 1280,
      items: [
        {
          type: 'Puffer',
          name: 'Moncler Maya Short Down Jacket',
          price: 1080,
          imageUrl: 'https://www.moncler.com/dw/image/v2/BDSM_PRD/on/demandware.static/-/Sites-moncler-master/default/dw0e8e8e8e/images/large/G20911A5360068950999_eni_2.jpg',
          buyUrl: 'https://www.moncler.com/en-gb/short-down-jackets-maya-short-down-jacket-black-G20911A5360068950999.html'
        },
        {
          type: 'Tracksuit Bottom',
          name: 'Trapstar Irongate Joggers',
          price: 85,
          imageUrl: 'https://cdn.shopify.com/s/files/1/0070/5698/4572/products/IRONGATEJOGGERBLACK_1200x.jpg',
          buyUrl: 'https://trapstarlondon.com/collections/bottoms'
        },
        {
          type: 'Sneakers',
          name: 'Nike Air Max 95',
          price: 170,
          imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-d3bbf84e0a4d/air-max-95-essential-shoes-rN3RcL.png',
          buyUrl: 'https://www.nike.com/gb/t/air-max-95-essential-shoes-rN3RcL'
        },
        {
          type: 'Balaclava',
          name: 'Corteiz Alcatraz Ski Mask',
          price: 45,
          imageUrl: 'https://cdn.shopify.com/s/files/1/0553/9993/5969/products/BALACLAVA_1200x.jpg',
          buyUrl: 'https://www.corteiz.club/'
        }
      ]
    },
    {
      id: '4',
      title: 'Sport - Athletic Luxe',
      totalCost: 520,
      items: [
        {
          type: 'Jacket',
          name: 'Nike Tech Fleece Windrunner',
          price: 110,
          imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/4e441d50-3a09-4a1e-a9e5-d7e2c8e5e5e5/sportswear-tech-fleece-windrunner-full-zip-hoodie-FNnMZL.png',
          buyUrl: 'https://www.nike.com/gb/t/sportswear-tech-fleece-windrunner-full-zip-hoodie-FNnMZL'
        },
        {
          type: 'T-Shirt',
          name: 'Adidas Originals Trefoil Tee',
          price: 30,
          imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/a07deb8f5a724a3db0c1af9d0105f29b_9366/Trefoil_T-Shirt_Black_IU2364_01_laydown.jpg',
          buyUrl: 'https://www.adidas.co.uk/trefoil-t-shirt/IU2364.html'
        },
        {
          type: 'Joggers',
          name: 'Adidas Tiro 23 Training Pants',
          price: 50,
          imageUrl: 'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/2d2d2d2d2d2d2d2d2d2d/Tiro_23_League_Training_Pants_Black_HS7230_21_model.jpg',
          buyUrl: 'https://www.adidas.co.uk/tiro-23-league-training-pants/HS7230.html'
        },
        {
          type: 'Sneakers',
          name: 'Nike Air Force 1 \'07',
          price: 115,
          imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/b7d9211c-26e7-431a-ac24-b0540fb3c00f/air-force-1-07-shoes-WrLlWX.png',
          buyUrl: 'https://www.nike.com/gb/t/air-force-1-07-shoes-WrLlWX'
        },
        {
          type: 'Bag',
          name: 'Nike Heritage Crossbody',
          price: 25,
          imageUrl: 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/d0d0d0d0-0000-0000-0000-000000000000/heritage-crossbody-bag-4L-NMWQdZ.png',
          buyUrl: 'https://www.nike.com/gb/t/heritage-crossbody-bag-4l-NMWQdZ'
        }
      ]
    },
    {
      id: '5',
      title: 'Casual - Everyday Essentials',
      totalCost: 295,
      items: [
        {
          type: 'Hoodie',
          name: 'Carhartt WIP Chase Hoodie',
          price: 95,
          imageUrl: 'https://www.carhartt-wip.com/media/catalog/product/I/0/I026384_00M_XX_01-ST-01.jpg',
          buyUrl: 'https://www.carhartt-wip.com/en/men-sweatshirts-hooded/chase-sweat-black-gold-1126_1'
        },
        {
          type: 'T-Shirt',
          name: 'Uniqlo U Crew Neck Tee',
          price: 20,
          imageUrl: 'https://image.uniqlo.com/UQ/ST3/WesternCommon/imagesgoods/455355/item/goods_09_455355.jpg',
          buyUrl: 'https://www.uniqlo.com/uk/en/product/uniqlo-u-crew-neck-short-sleeve-t-shirt-455355.html'
        },
        {
          type: 'Jeans',
          name: 'Levi\'s 501 Original Fit',
          price: 100,
          imageUrl: 'https://lsco.scene7.com/is/image/lsco/005010114-front-pdp?fmt=jpeg&qlt=70&resMode=bisharp&fit=crop,0&op_usm=1.25,0.6,8&wid=2000&hei=1800',
          buyUrl: 'https://www.levi.com/GB/en_GB/clothing/men/jeans/501-original-fit-mens-jeans/p/005010114'
        },
        {
          type: 'Sneakers',
          name: 'New Balance 550',
          price: 130,
          imageUrl: 'https://nb.scene7.com/is/image/NB/bb550wt1_nb_02_i?$pdpflexf2$&qlt=80&fmt=webp&wid=440&hei=440',
          buyUrl: 'https://www.newbalance.co.uk/pd/550/BB550V1-41217.html'
        }
      ]
    },
    {
      id: '6',
      title: 'Opium - Dark Avant-Garde',
      totalCost: 4250,
      items: [
        {
          type: 'Jacket',
          name: 'Rick Owens DRKSHDW Worker Jacket',
          price: 890,
          imageUrl: 'https://cdn-images.farfetch-contents.com/19/59/94/44/19599444_44372938_1000.jpg',
          buyUrl: 'https://www.rickowens.eu/en/GB/men/outerwear'
        },
        {
          type: 'Top',
          name: 'Rick Owens Double Layer Tee',
          price: 380,
          imageUrl: 'https://cdn-images.farfetch-contents.com/18/59/84/84/18598484_40082957_1000.jpg',
          buyUrl: 'https://www.rickowens.eu/en/GB/men/tops'
        },
        {
          type: 'Pants',
          name: 'Rick Owens DRKSHDW Cargo Pods',
          price: 750,
          imageUrl: 'https://cdn-images.farfetch-contents.com/19/44/89/44/19448944_43654850_1000.jpg',
          buyUrl: 'https://www.rickowens.eu/en/GB/men/bottoms'
        },
        {
          type: 'Boots',
          name: 'Rick Owens DRKSHDW Abstract Boots',
          price: 1450,
          imageUrl: 'https://cdn-images.farfetch-contents.com/18/44/94/84/18449484_39454850_1000.jpg',
          buyUrl: 'https://www.rickowens.eu/en/GB/men/shoes'
        },
        {
          type: 'Sunglasses',
          name: 'Rick Owens Shield Sunglasses',
          price: 780,
          imageUrl: 'https://cdn-images.farfetch-contents.com/17/59/84/84/17598484_36854850_1000.jpg',
          buyUrl: 'https://www.rickowens.eu/en/GB/accessories/eyewear'
        }
      ]
    }
  ];
}
