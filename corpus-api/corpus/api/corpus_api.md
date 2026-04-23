# Corpus API
---

## 트리 전체 조회
- curl "http://(URL)/corpus/api/1.0/tree?path="

## 트리 특정 path 조회
- curl "http://(URL)/corpus/api/1.0/tree?path=ganpan"
- curl "http://(URL)/corpus/api/1.0/tree?path=ganpan/flex"

## 페이지 조회
- curl "http://(URL)/corpus/api/1.0/page?path=home"
- curl "http://(URL)/corpus/api/1.0/page?path=ganpan/flex"

## 페이지 저장
- curl -X PUT "http://(URL)/corpus/api/1.0/page" \
  -H "Content-Type: application/json" \
  -d '{ \
    "path": "ganpan/new-page", \
    "content": "# New Page\n\nhello wiki" \
  }'

## 디렉토리 생성
- curl -X POST "http://(URL)/corpus/api/1.0/dir" \
  -H "Content-Type: application/json" \
  -d '{"path":"ganpan/category-a"}'

## 페이지 삭제
- curl -X DELETE "http://(URL)/corpus/api/1.0/page?path=ganpan/new-page"