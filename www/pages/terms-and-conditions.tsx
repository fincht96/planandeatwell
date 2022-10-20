import { Container } from "@chakra-ui/react";
import Head from "next/head";
import Layout from "../components/layout";
import { Text, Link } from "@chakra-ui/react";
import { forwardRef, Box, TextProps } from "@chakra-ui/react";

const Title = forwardRef<TextProps, "h1">((props, ref) => (
  <Text color="gray.dark" fontSize={"36px"} ref={ref} as={"h1"} {...props} />
));

const Heading = forwardRef<TextProps, "h3">((props, ref) => (
  <Text fontSize={"24px"} ref={ref} as={"h3"} {...props} />
));

const MainText = forwardRef<TextProps, "p">((props, ref) => (
  <Text
    fontSize={"16"}
    color="gray.normal"
    fontWeight={400}
    ref={ref}
    {...props}
  />
));

export default function TermsAndConditions() {
  return (
    <Layout>
      <Head>
        <title>Terms and Conditions</title>
      </Head>

      <Container
        maxW="1200px"
        mt={"5rem"}
        mb={20}
        sx={{ position: "relative" }}
      >
        <Box mb={5}>
          <Title mb={2}>Terms and Conditions</Title>
          <MainText>
            Effective date: Sep 28, 2022
            <br />
            <br />
            These Terms and Conditions (&quot;Terms&quot;, &quot;Terms and
            Conditions&quot;) govern your relationship with planandeatwell.uk
            website (the &quot;Service&quot;) operated by New Stack Limited
            (&quot;us&quot;, &quot;we&quot;, or &quot;our&quot;). Please read
            these Terms and Conditions carefully before using the Service. Your
            access to and use of the Service is conditioned on your acceptance
            of and compliance with these Terms. These Terms apply to all
            visitors, users and others who access or use the Service. By
            accessing or using the Service you agree to be bound by these Terms.
            If you disagree with any part of the terms then you may not access
            the Service.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Copyright</Heading>
          <MainText>
            We respect the intellectual property rights of others. It is our
            policy to respond to any claim that Content posted on the Service
            infringes the copyright or other intellectual property infringement
            (&quot;Infringement&quot;) of any person. If you are a copyright
            owner, or authorized on behalf of one, and you believe that the
            copyrighted work has been copied in a way that constitutes copyright
            infringement that is taking place through the Service, you must
            submit your notice in writing to the attention of &quot;Copyright
            Infringement&quot; of support@planandeatwell.uk and include in your
            notice a detailed description of the alleged Infringement. You may
            be held accountable for damages (including costs and attorneys&#39;
            fees) for misrepresenting that any Content is infringing your
            copyright.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Intellectual Property</Heading>
          <MainText>
            The Service and its original content (excluding Content provided by
            users), features and functionality are and will remain the exclusive
            property of Plan and Eat Well and its licensors. The Service is
            protected by copyright, trademark, and other laws of both Europe
            (UK) and foreign countries. Our trademarks and trade dress may not
            be used in connection with any product or service without the prior
            written consent of Plan and Eat Well.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Links To Other Web Sites</Heading>
          <MainText>
            Our Service may contain links to third-party web sites or services
            that are not owned or controlled by Plan and Eat Well. Plan and Eat
            Well has no control over, and assumes no responsibility for, the
            content, privacy policies, or practices of any third party web sites
            or services. You further acknowledge and agree that Plan and Eat
            Well shall not be responsible or liable, directly or indirectly, for
            any damage or loss caused or alleged to be caused by or in
            connection with use of or reliance on any such content, goods or
            services available on or through any such web sites or services. We
            strongly advise you to read the terms and conditions and privacy
            policies of any third-party web sites or services that you visit.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Limitation of Liability</Heading>
          <MainText>
            In no event shall Plan and Eat Well, nor its directors, employees,
            partners, agents, suppliers, or affiliates, be liable for any
            indirect, incidental, special, consequential or punitive damages,
            including without limitation, loss of profits, data, use, goodwill,
            or other intangible losses, resulting from (i) your access to or use
            of or inability to access or use the Service; (ii) any conduct or
            content of any third party on the Service; (iii) any content
            obtained from the Service; and (iv) unauthorized access, use or
            alteration of your transmissions or content, whether based on
            warranty, contract, tort (including negligence) or any other legal
            theory, whether or not we have been informed of the possibility of
            such damage, and even if a remedy set forth herein is found to have
            failed of its essential purpose.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Disclaimer</Heading>
          <MainText>
            Your use of the Service is at your sole risk. The Service is
            provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis.
            The Service is provided without warranties of any kind, whether
            express or implied, including, but not limited to, implied
            warranties of merchantability, fitness for a particular purpose,
            non-infringement or course of performance. Plan and Eat Well its
            subsidiaries, affiliates, and its licensors do not warrant that a)
            the Service will function uninterrupted, secure or available at any
            particular time or location; b) any errors or defects will be
            corrected; c) the Service is free of viruses or other harmful
            components; or d) the results of using the Service will meet your
            requirements.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Governing Law</Heading>
          <MainText>
            These Terms shall be governed and construed in accordance with the
            laws of Europe (UK), without regard to its conflict of law
            provisions. <br /> Our failure to enforce any right or provision of
            these Terms will not be considered a waiver of those rights. If any
            provision of these Terms is held to be invalid or unenforceable by a
            court, the remaining provisions of these Terms will remain in
            effect. These Terms constitute the entire agreement between us
            regarding our Service, and supersede and replace any prior
            agreements we might have between us regarding the Service.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Changes</Heading>
          <MainText>
            We reserve the right, at our sole discretion, to modify or replace
            these Terms at any time. If a revision is material we will try to
            provide at least 30 days notice prior to any new terms taking
            effect. What constitutes a material change will be determined at our
            sole discretion. By continuing to access or use our Service after
            those revisions become effective, you agree to be bound by the
            revised terms. If you do not agree to the new terms, please stop
            using the Service.
          </MainText>
        </Box>

        <Box mb={5}>
          <Heading mb={2}>Contact Us</Heading>
          <MainText>
            If you have any questions about these terms, please contact us:
            <br /> By email:&nbsp;
            <Link
              fontWeight={500}
              href="mailto:support@planandeatwell.uk"
              isExternal
            >
              support@planandeatwell.uk
            </Link>
          </MainText>
        </Box>
      </Container>
    </Layout>
  );
}
