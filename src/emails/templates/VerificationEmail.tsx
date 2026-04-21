import * as React from "react";
import {
  Html,
  Body,
  Preview,
  Container,
  Text,
  Hr,
  Head,
  Font,
  Section,
  Row,
  Column,
} from "@react-email/components";

export function Email({ firstName, verificationToken, email }: any) {
  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily="Geist Mono"
          fallbackFontFamily="monospace"
          webFont={{
            url: "https://fonts.gstatic.com/s/geistmono/v1/or3NQ7aH_IQn4Y4qsBRDiPMzHQ.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={body}>
        <Preview>
          {firstName ? `Hey ${firstName}, ` : ""}Your Taskflow verification code
          is ready
        </Preview>
        <Container style={outer}>
          <Section style={header}>
            <Row>
              <Column>
                <Text style={logoMark}>⬡</Text>
              </Column>
              <Column align="right">
                <Text style={logoText}>Taskflow</Text>
              </Column>
            </Row>
          </Section>
          <Section style={card}>
            <div style={accentLine} />

            <Section style={cardInner}>
              <Text style={greeting}>
                {firstName ? `Hey, ${firstName}.` : "Welcome back."}
              </Text>

              <Text style={bodyText}>
                Use the code below to verify your identity. It expires in{" "}
                <span style={highlight}>15 minutes</span>.
              </Text>

              <Section style={codeWrapper}>
                <Text style={codeLabel}>VERIFICATION CODE</Text>
                <Text style={codeBlock}>{verificationToken}</Text>
                <Text style={codeSubtext}>
                  Do not share this code with anyone.
                </Text>
              </Section>

              <Hr style={divider} />

              {email && (
                <Text style={accountText}>
                  Sent to <span style={emailHighlight}>{email}</span>
                </Text>
              )}
            </Section>
          </Section>

          <Section style={footer}>
            <Text style={footerCopy}>
              © {new Date().getFullYear()} Taskflow · Built for teams that ship
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default Email;

const body: React.CSSProperties = {
  backgroundColor: "#0c0c0f",
  fontFamily: "'Geist Mono', 'Courier New', monospace",
  margin: 0,
  padding: "40px 0",
};

const outer: React.CSSProperties = {
  maxWidth: "520px",
  margin: "0 auto",
  padding: "0 16px",
};

const header: React.CSSProperties = {
  padding: "0 0 24px 0",
};

const logoMark: React.CSSProperties = {
  fontSize: "22px",
  color: "#5b6af0",
  margin: 0,
  lineHeight: 1,
};

const logoText: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "0.18em",
  textTransform: "uppercase" as const,
  color: "#5b5b72",
  margin: 0,
  lineHeight: "22px",
};

const card: React.CSSProperties = {
  backgroundColor: "#13131a",
  borderRadius: "12px",
  border: "1px solid #1f1f2e",
  overflow: "hidden",
};

const accentLine: React.CSSProperties = {
  height: "3px",
  background: "linear-gradient(90deg, #5b6af0 0%, #8b5cf6 50%, #06b6d4 100%)",
};

const cardInner: React.CSSProperties = {
  padding: "36px 40px 32px",
};

const greeting: React.CSSProperties = {
  fontSize: "22px",
  fontWeight: 700,
  color: "#f0f0f8",
  margin: "0 0 12px",
  letterSpacing: "-0.02em",
};

const bodyText: React.CSSProperties = {
  fontSize: "14px",
  color: "#8888a8",
  lineHeight: "1.6",
  margin: "0 0 32px",
};

const highlight: React.CSSProperties = {
  color: "#a5b4fc",
  fontWeight: 600,
};

const codeWrapper: React.CSSProperties = {
  backgroundColor: "#0c0c0f",
  border: "1px solid #2a2a3e",
  borderRadius: "8px",
  padding: "24px 28px",
  margin: "0 0 28px",
};

const codeLabel: React.CSSProperties = {
  fontSize: "10px",
  fontWeight: 700,
  letterSpacing: "0.2em",
  color: "#5b6af0",
  margin: "0 0 12px",
  textTransform: "uppercase" as const,
};

const codeBlock: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: 700,
  color: "#f0f0f8",
  letterSpacing: "0.25em",
  margin: "0 0 10px",
  lineHeight: 1.2,
};

const codeSubtext: React.CSSProperties = {
  fontSize: "11px",
  color: "#44445a",
  margin: 0,
  letterSpacing: "0.04em",
};

const divider: React.CSSProperties = {
  borderColor: "#1f1f2e",
  margin: "0 0 24px",
};

const footerText: React.CSSProperties = {
  fontSize: "12px",
  color: "#55556a",
  lineHeight: "1.6",
  margin: "0 0 12px",
};

const accountText: React.CSSProperties = {
  fontSize: "12px",
  color: "#44445a",
  margin: 0,
};

const emailHighlight: React.CSSProperties = {
  color: "#6366f1",
};

const footer: React.CSSProperties = {
  padding: "20px 0 0",
  textAlign: "center" as const,
};

const footerCopy: React.CSSProperties = {
  fontSize: "11px",
  color: "#333348",
  letterSpacing: "0.06em",
  margin: 0,
};
