# Zustand Store Documentation

이 문서는 Zustand를 사용한 앱 상태 관리 스토어에 대한 설명입니다.

## Store 구조

### State Entities

1. **api_ip** (string): IPv4 형식의 API 서버 IP 주소
2. **offline_mode** (boolean): 오프라인 모드 활성화 상태
3. **offline_data** (Inspection[]): 오프라인에서 저장된 inspection 데이터 배열

### CRUD Operations

#### API IP 관리

- `setApiIp(ip: string)`: IPv4 형식 검증 후 API IP 설정
- `getApiIp()`: 현재 API IP 반환

#### Offline Mode 관리

- `setOfflineMode(mode: boolean)`: 오프라인 모드 설정
- `toggleOfflineMode()`: 오프라인 모드 토글
- `getOfflineMode()`: 현재 오프라인 모드 상태 반환

#### Inspection 데이터 CRUD

- `addInspection(inspection: Inspection)`: 새로운 inspection 추가
- `updateInspection(id: string, updates: Partial<Inspection>)`: inspection 업데이트
- `deleteInspection(id: string)`: inspection 삭제
- `getInspection(id: string)`: 특정 inspection 조회
- `getAllInspections()`: 모든 inspection 조회
- `clearAllInspections()`: 모든 inspection 삭제
- `getInspectionsByLocation(location: string)`: 위치별 inspection 필터링
- `getInspectionsByCondition(condition: Inspection['condition'])`: 상태별 inspection 필터링

## 사용 방법

### 기본 사용법

```typescript
import { useAppStore } from "../stores";

// 컴포넌트에서 사용
const MyComponent = () => {
  const { api_ip, offline_mode, offline_data } = useAppStore();
  const { setApiIp, addInspection } = useAppStore();

  // 상태 사용
  console.log("Current API IP:", api_ip);

  // 액션 사용
  const handleSetIp = () => {
    setApiIp("192.168.1.100");
  };

  const handleAddInspection = () => {
    addInspection({
      id: "1",
      extinguisherId: "EXT001",
      location: "Building A",
      condition: "good",
      inspectedBy: "John Doe",
      date: "2024-01-15",
    });
  };

  return (
    <div>
      <p>API IP: {api_ip}</p>
      <p>Offline Mode: {offline_mode ? "Enabled" : "Disabled"}</p>
      <p>Inspections: {offline_data.length}</p>
    </div>
  );
};
```

### Selector 사용법 (성능 최적화)

```typescript
import { useAppStore } from "../stores";

const MyComponent = () => {
  // 필요한 상태만 구독
  const api_ip = useAppStore((state) => state.api_ip);
  const offline_data = useAppStore((state) => state.offline_data);

  // 필요한 액션만 가져오기
  const setApiIp = useAppStore((state) => state.setApiIp);
  const addInspection = useAppStore((state) => state.addInspection);

  return <div>{/* 컴포넌트 내용 */}</div>;
};
```

### Utility 함수 사용

```typescript
import { storeUtils, useStoreState, useStoreActions } from "../stores";

const MyComponent = () => {
  const { offline_data } = useStoreState();
  const { addInspection } = useStoreActions();

  // 검증 함수 사용
  const isValidIp = storeUtils.isValidIPv4("192.168.1.1"); // true

  // 새로운 inspection 생성
  const newInspection = storeUtils.createInspection({
    extinguisherId: "EXT001",
    location: "Building A",
    condition: "good",
    inspectedBy: "John Doe",
    date: "2024-01-15",
  });

  // 검색 기능
  const searchResults = storeUtils.searchInspections(offline_data, "Building");

  // 통계 정보
  const stats = storeUtils.getInspectionStats(offline_data);

  return (
    <div>
      <p>Total: {stats.total}</p>
      <p>By Condition: {JSON.stringify(stats.byCondition)}</p>
    </div>
  );
};
```

## 예제 컴포넌트

`src/components/store-example.tsx` 파일에서 전체 기능을 테스트할 수 있는 예제 컴포넌트를 제공합니다.

## 주의사항

1. **IPv4 검증**: `setApiIp` 함수는 IPv4 형식을 검증합니다. 잘못된 형식의 IP는 설정되지 않습니다.
2. **성능 최적화**: Selector를 사용하여 필요한 상태만 구독하세요.
3. **타입 안전성**: TypeScript를 사용하여 타입 안전성을 보장합니다.
4. **상태 지속성**: 현재는 메모리에만 저장됩니다. 필요시 localStorage나 다른 지속성 솔루션을 추가하세요.

## 확장 가능성

- **지속성**: localStorage, IndexedDB 등에 상태 저장
- **동기화**: 서버와의 데이터 동기화 기능
- **실시간 업데이트**: WebSocket 등을 통한 실시간 상태 업데이트
- **상태 히스토리**: undo/redo 기능
- **상태 분기**: 개발/프로덕션 환경별 상태 관리
