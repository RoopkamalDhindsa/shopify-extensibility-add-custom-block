import React, { useEffect, useState } from "react";
import {
  reactExtension,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  useApi,
} from "@shopify/ui-extensions-react/checkout";
// [START product-offer-pre-purchase.ext-index]
// Set up the entry point for the extension
export default reactExtension("purchase.checkout.block.render", () => <App />);
// [END product-offer-pre-purchase.ext-index]

function App() {
  const { query, i18n } = useApi();
  // [START product-offer-pre-purchase.add-to-cart]
  const applyCartLinesChange = useApplyCartLinesChange();
  // [END product-offer-pre-purchase.add-to-cart]
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);
  // [START product-offer-pre-purchase.retrieve-cart-data]
  const lines = useCartLines();
  // [END product-offer-pre-purchase.retrieve-cart-data]

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);


  // [START product-offer-pre-purchase.retrieve-products]
  async function fetchProducts() {
    setLoading(true);
    try {
      const { data } = await query(
        `query ($first: Int!) {
          products(first: $first) {
            nodes {
              id
              title
              images(first:1){
                nodes {
                  url
                }
              }
              variants(first: 1) {
                nodes {
                  id
                  price {
                    amount
                  }
                }
              }
            }
          }
        }`,
        {
          variables: { first: 5 },
        }
      );
      setProducts(data.products.nodes);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  // [END product-offer-pre-purchase.retrieve-products]

  if (loading) {
    return <LoadingSkeleton />;
  }

  const productsOnOffer = getProductsOnOffer(lines, products);

  if (!productsOnOffer.length) {
    return null;
  }

  const orangeStyle = {
    color: 'orange',
  };

  return (
    <BlockStack spacing='loose' id="main_rendered_custom_block">
      <Divider />
      <Heading level={1} style={orangeStyle}>WHY OVER 200,000 PEOPLE ENJOY NOONBREW</Heading>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <Image source="https://cdn.shopify.com/s/files/1/0611/0281/7334/files/gift_card.png?v=1716562235" />
          <BlockStack spacing='none'>
            <Heading level={2}>60 Day 100% Money Back Guarantee</Heading>
            <Text size="small">Not happy with your purchase Just email hi@noonbrew.co and we'll take care of you.</Text>
          </BlockStack>
        </InlineLayout>
      </BlockStack>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <Image source="https://cdn.shopify.com/s/files/1/0611/0281/7334/files/gift_card.png?v=1716562235" />
          <BlockStack spacing='none'>
            <Heading level={2}>60 Day 100% Money Back Guarantee</Heading>
            <Text size="small">Not happy with your purchase Just email hi@noonbrew.co and we'll take care of you.</Text>
          </BlockStack>
        </InlineLayout>
      </BlockStack>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <Image source="https://cdn.shopify.com/s/files/1/0611/0281/7334/files/gift_card.png?v=1716562235" />
          <BlockStack spacing='none'>
            <Heading level={2}>60 Day 100% Money Back Guarantee</Heading>
            <Text size="small">Not happy with your purchase Just email hi@noonbrew.co and we'll take care of you.</Text>
          </BlockStack>
        </InlineLayout>
      </BlockStack>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <Image source="https://cdn.shopify.com/s/files/1/0611/0281/7334/files/gift_card.png?v=1716562235" />
          <BlockStack spacing='none'>
            <Heading level={2}>60 Day 100% Money Back Guarantee</Heading>
            <Text size="small">Not happy with your purchase Just email hi@noonbrew.co and we'll take care of you.</Text>
          </BlockStack>
        </InlineLayout>
      </BlockStack>
    </BlockStack>
  );
}

// [START product-offer-pre-purchase.loading-state]
function LoadingSkeleton() {
  return (
    <BlockStack spacing='loose'>
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <SkeletonImage aspectRatio={1} />
          <BlockStack spacing='none'>
            <SkeletonText inlineSize='large' />
            <SkeletonText inlineSize='small' />
          </BlockStack>
          <Button kind='secondary' disabled={true}>
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
    </BlockStack>
  );
}
// [END product-offer-pre-purchase.loading-state]

// [START product-offer-pre-purchase.filter-products]
function getProductsOnOffer(lines, products) {
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  return products.filter((product) => {
    const isProductVariantInCart = product.variants.nodes.some(({ id }) =>
      cartLineProductVariantIds.includes(id)
    );
    return !isProductVariantInCart;
  });
}
// [END product-offer-pre-purchase.filter-products]

// [START product-offer-pre-purchase.offer-ui]
function ProductOffer({ product, i18n, adding, handleAddToCart, showError }) {
  const { images, title, variants } = product;
  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);
  const imageUrl =
    images.nodes[0]?.url ??
    'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081';

  return (
    <BlockStack spacing='loose'>
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing='loose'>
        <InlineLayout
          spacing='base'
          columns={[64, 'fill', 'auto']}
          blockAlignment='center'
        >
          <Image
            border='base'
            borderWidth='base'
            borderRadius='loose'
            source={imageUrl}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing='none'>
            <Text size='medium' emphasis='strong'>
              {title}
            </Text>
            <Text appearance='subdued'>{renderPrice}</Text>
          </BlockStack>
          <Button>
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {showError && <ErrorBanner />}
    </BlockStack>
  );
}
// [END product-offer-pre-purchase.offer-ui]

// [START product-offer-pre-purchase.error-ui]
function ErrorBanner() {
  return (
    <Banner status='critical'>
      There was an issue adding this product. Please try again.
    </Banner>
  );
}
// [END product-offer-pre-purchase.error-ui]
