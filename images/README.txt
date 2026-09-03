[이미지 교체 안내]

아래 파일명으로 이미지를 넣으면 자동으로 표시됩니다.
(파일이 없으면 자리 표시 디자인이 대신 보입니다)

- profile.jpg           : 자기소개 프로필 사진 (세로형 3:4 권장)
- project-library.jpg   : 별빛도서관 목업 캡처 (가로형 16:10 권장)
- project-lume.jpg      : LUMÉ 목업 캡처
- project-bebe.jpg      : BEBE DE PINO 목업 캡처
- project-hokkaido.jpg  : 온홋카이도 목업 캡처

DETAIL / WEB 버튼 링크는 index.html에서 href="#" 부분을
실제 상세페이지 · 배포 주소로 바꿔주세요.

[디테일 페이지용 이미지 — 4개 프로젝트 공통 규칙]
각 프로젝트의 slug: detail-library / detail-lume / detail-bebe / detail-hokkaido

- {slug}-full.jpg     : 전체 페이지 세로 캡처
- {slug}-f1.jpg ~ f4.jpg : FEATURE 1~4 캡처 (GIF로 교체 시 확장자만 맞춰서 img src 수정)
- {slug}-desktop.jpg  : 데스크톱 캡처 (16:10)
- {slug}-tablet.jpg   : 태블릿 캡처 (3:4)
- {slug}-mobile.jpg   : 모바일 캡처 (9:19)

예) 온홋카이도 → detail-hokkaido-full.jpg, detail-hokkaido-f1.jpg ...


[PROJECT 카드 자동 스크롤 이미지 안내]
메인 페이지 PROJECT 섹션의 4개 카드는 이제 각 프로젝트의 "풀페이지 스크린샷" 한 장을
그대로 재사용합니다 (디테일 페이지 OVERVIEW의 -full.jpg 와 동일 파일).
- 카드에 마우스를 올리면 이 이미지가 프레임 안에서 천천히 아래로 스크롤되며
  페이지 하단까지 보여주고, 다시 위로 돌아오는 루프 애니메이션이 자동 재생됩니다.
- 이미지는 세로로 길수록(즉 실제 페이지 전체를 캡처한 스크린샷일수록) 효과가 좋습니다.
  일반 스크린샷 도구의 "전체 페이지 캡처" 기능을 사용하세요.
- 스크롤 이동 거리는 css/style.css의 .project-card__mockup--{slug} .mockup__img 블록에서
  --scroll-distance 값으로 프로젝트별 조정 가능합니다 (이미지가 유난히 더 길거나
  짧으면 이 값을 -60%~-85% 사이에서 조절해 보세요).
