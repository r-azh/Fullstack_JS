-- Create blogs table
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

-- Insert sample blogs
INSERT INTO blogs (author, url, title, likes) 
VALUES ('Dan Abramov', 'https://example.com/let-vs-const', 'On let vs const', 0);

INSERT INTO blogs (author, url, title, likes) 
VALUES ('Laurenz Albe', 'https://example.com/gaps-sequences', 'Gaps in sequences in PostgreSQL', 0);
