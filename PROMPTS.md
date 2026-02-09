# Project Prompts History

## Initial Prompt
I want to create a Taxonomy Tool called PowerTaxonomy.
Prompt
The Tool, compares a client SKU’s content to competitors’ SKUs, highlights improvement areas, and generates ready-to-use content recommendations aligned with Amazon’s guidelines.
UI Guidelines:
The tool will ask from the User
Step 1:
To Upload the Raw Product Data from a CSV File.
A PDF attachment that calls out the Product Guidelines. The PDF will contain both Textual and Image Format Information and it is imperative that the Tool leverages both these functionalities.
Ask for the Company for which the report is being Generated. This should be a dropdown list that includes top Global Retailers. The input will be flexible and category agnostic, as this tool can be used for multiple companies although the Data format will stay the same.
Depending on the input Company selected the output's design should be tailored to the Company in Question in terms of Color Combination, Fonts used and general Look and Feel.
Step 2:
Once the details are uploaded, User can select a SKU ID from a dropdown or enter it in a Text Box Prompt and hit Analyse which is the CTA button.
Step 3:
Output:
A report comparing the SKU with other similar items on: title length, bullet points clarity, description, and any other vectors. Top 3 suggested edits to the SKU, with inline competitor references and links to Amazon content rules. Edits must be compliant with the Amazon compliance guidelines (also shared). When the user approves the changes, produce a final Markdown summary
Schema Understanding of the CSV Input
sku_id -> Refers to product Id
title -> Refers to the product title on Amazon PDP
universe -> Refers to the category of the product
image_url -> This might have multiple images in a comma separated manner. They usually point to the front and back image of the same product
bullets -> Refers to the Positioning Statement of the Product, usually contains more information for the consumer to make a decision
min_rank_search-> Refers to the minimum rank of the product in search based on Search Prompt
avg_rank_search -> Refers to the average rank of the product in search based on Search prompt
min_rank_categroy -> Refers to the rank where the product is displayed in the category
avg_rank_category -> Refers to the average rank where the product is displayed in the category page
retailer_category_node -> Refers to the Sub category of the product in the taxonomy tree
retailer_brand_name ->The brand selling the product
description_filled -> The Product Description
Edge Cases for Data Misses in The CSV file
in case the Brand Name is empty, try to find the brand name from the title and levarage the same in output.
Images are mentioned in the [" "," " ] Format, the information between the inverted commas refer to the url where the image is hosted

## Design Update
From a design Perspective use the design type of Commerce IQ website. [https://www.commerceiq.ai/](https://www.google.com/url?sa=E&q=https%3A%2F%2Fwww.commerceiq.ai%2F)
Enable users to upload their company logo. This logo should be prominently featured on the generated PowerTaxonomy reports, alongside the selected company's color scheme and fonts, to reinforce branding.
Incorporate advanced filtering options for the SKU selection process. Users should be able to filter SKUs by brand name, category (universe), min_rank_search, avg_rank_search, min_rank_category, and avg_rank_category before proceeding to the analysis step.
For the selected SKU, generate a visual comparison of key metrics (title length, bullet point count, description length, image count) against its top 3 competitors. Present this data using clear charts or graphs within the report.
The output of the report should be downloadable in a PDF format.

## Branding Update
Make the page Visually Appealing and optimize the home page for keywords in SEO search. Use a Futuristiic Design Pattern with High Contrast Text. Use Roboto thoroughout as default font

## Logo Update
Remove the Logo Requirement , source the Logo from Internet based on retailer chosen

## CSV Parsing Updates
IN case the CSV file has any issue, try to convert all fields to lower case.

## PDF Parsing Update
IN the PDF file is not readable, convert the PDF to a .TXT file, ignore the images and consume the raw text data.

## Debugging Request
My tool is not working, based on the recently uploaded documents can you please check what is failing?

## Error Resolution
It is still giving the below error
"Uncaught TypeError: Cannot read properties of undefined (reading 'toLowerCase')"
Could you please help me resolve it ?

## Output Formatting
Great Product, couple of edits
Once the Audit is complete and recommendation is generated and user accepts the recommendation , could you please make the output in the format of the uploaded excel with the Recommended Changes Updating the original Entry, Only showcasing the one row that is analysed is sufficient. Whatever fields are unchanged keep them as is

## Textual Changes
Textual Changes
Optimize Amazon SKU
Intelligence.-> Optimized SKU Intelligence
Deploy the industry's most advanced taxonomy intelligence engine. PowerTaxonomy leverages multimodal AI to benchmark competitors and ensure Amazon content compliance at scale. -> Remove all mentions of a particular brand like Amazon.

## Final Feature Request
Give an option to download the CSV row output in a CSV format.
Also show the Optimized Taxonomy Record in a Box View with the images.
Rest of the output is fine, keep them.
