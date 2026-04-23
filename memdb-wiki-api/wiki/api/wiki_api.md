# WIKI API
---

## 트리 전체 조회
curl "http://(URL)/api/wiki/tree?path="

## 트리 특정 path 조회
curl "http://(URL)/api/wiki/tree?path=ganpan"
curl "http://(URL)/api/wiki/tree?path=ganpan/flex"

## 페이지 조회
curl "http://(URL)/api/wiki/page?path=home"
curl "http://(URL)/api/wiki/page?path=ganpan/flex"

## 페이지 저장
curl -X PUT "http://(URL)/api/wiki/page" \
  -H "Content-Type: application/json" \
  -d '{
    "path": "ganpan/new-page",
    "content": "# New Page\n\nhello wiki"
  }'

## 디렉토리 생성
curl -X POST "http://localhost:3100/api/wiki/dir" \
  -H "Content-Type: application/json" \
  -d '{"path":"ganpan/category-a"}'

## 페이지 삭제
curl -X DELETE "http://localhost:3100/api/wiki/page?path=ganpan/new-page"